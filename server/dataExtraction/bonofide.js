const { TextractClient, DetectDocumentTextCommand } = require("@aws-sdk/client-textract");
const fs = require("fs");

// AWS Configuration
const client = new TextractClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: "AKIARHJJMURY47K573GX",
        secretAccessKey: "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"
    }
});

// Detect and Parse Data
const extractDetailsFromBonofide = async (imagePath) => {
    const imageBytes = fs.readFileSync(imagePath);

    const command = new DetectDocumentTextCommand({
        Document: { Bytes: imageBytes }
    });

    try {
        const response = await client.send(command);

        // Extract and Clean Lines
        const lines = response.Blocks
            .filter(block => block.BlockType === "LINE")
            .map(block => block.Text.trim())
            .filter(line => line.length > 0);

        console.log("Cleaned Lines:", lines);

        // Parse Key Fields
        const parsedData = {
            collegeName: extractSameLine(lines, /COLLEGE/i),
            collegeAddress: extractSameLine(lines, /500/i),
            hallticketNo: extractField(lines, /bearing HT No./i),
            course:extractNextLine(lines,/is a bonafied student of this college studying/i),
            branch:extractNextLine(lines,/programme in/i),

        };
    
        return cleanData(parsedData);

    } catch (err) {
        console.error("Error:", err);
    }
};

;

// Extract Field Function
const extractField = (lines, regex, nextLineOffset = 0) => {
    for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
            // Check if field and value are on the same line
            const match = lines[i].match(regex);
            const value = lines[i].replace(match[0], "").trim(); // Extract value after the match
            if (value) return cleanValue(value.replace(/\s+/g, "")); // Remove all spaces

            // If no value on the same line, check next line
            return cleanValue(lines[i + nextLineOffset]);
        }
    }
    return "Not Found";
};

// Helper Functions
const extractSameLine = (lines, regex) => {
    for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
            return lines[i];
        }
    }
    return "Not Found";
};

const extractNextLine = (lines, regex) => {
    for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
            return lines[i + 1] ? lines[i + 1].trim() : "Not Found";
        }
    }
    return "Not Found";
};


// Clean Value Utility
const cleanValue = (value) => {
    return value
        ? value
            .replace(/^[,:\-]+|[,:\-]+$/g, "") // Remove leading/trailing colons, commas, or dashes
            .replace(/[^a-zA-Z0-9\s,.()\/-]/g, "") // Remove unwanted characters
            .trim()
        : "Not Found";
};

const cleanData = (data) => {
    const cleaned = {};
    for (const key in data) {
        cleaned[key] = data[key]
            ? data[key].replace(/[^a-zA-Z0-9\s,.()\/-]/g, "").trim()
            : "Not Found";
    }
    return cleaned;
};

// Example Invocation
//detectAndParseCaste("4th year bonofide.jpg");
module.exports = { extractDetailsFromBonofide };
