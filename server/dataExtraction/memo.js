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
const  extractDetailsFromMemo = async (filePath) => {
  const imageBytes = fs.readFileSync(filePath);

  const command = new DetectDocumentTextCommand({
    Document: { Bytes: imageBytes }
  });

  try {
    const response = await client.send(command);

    // Extract and Clean Lines
    const lines = response.Blocks
      .filter(block => block.BlockType === "LINE")
      .map(block => block.Text.replace(/:/g, "").trim()) // Remove colons and trim spaces
      .filter(line => line.length > 0); // Remove empty lines


    // Parse Key Fields
    const parsedData = {
        examBoardType: 'BOARD OF SECONDARY EDUCATION',
        state:extractNextLine(lines, /Board of Secondary Education\s*/i, 1),
        certificateType:extractSameLine(lines, /SCHOOL\s*/i, 1),
        candidateName: extractField(lines, /CERTIFIED THAT\s*/i, 1),
        fathersName: extractField(lines, /FATHER'S NAME\s*/i, 1),
        mothersName: extractField(lines, /MOTHER'S NAME\s*/i, 1),
        rollNumber: extractRollNumber(lines),
        dateOfBirth: extractDateOfBirth(lines),
        examType: extractMultiLineField(lines, /CERTIFICATE\s*/i, 1),
        aadhaarNo: extractField(lines, /Aadhaar No.\s*/i, 1),
        schoolName:extractFourthLine(lines, /DATE OF BIRTH\s*/i, 1),
        medium: extractField(lines, /MEDIUM\s*/i, 1),
        //examYear: extractExamYear(lines),
        examYear: extractField(lines, /Has appeared and PASSED SSC EXAMINATION held in \s*/i, 1),
        cgpa: extractNextLine(lines, /Cumulative Grade Point Average \s*/i, 1),
        identificationMark1:extractNextLine(lines, /Marks of Identification\s*/i, 1),
        identificationMark2:extractThirdLine(lines, /Marks of Identification\s*/i, 1),
      };

    return parsedData;
  } catch (err) {
    console.error("Error:", err);
  }
};

// Extract Field Function
const extractField = (lines, regex, nextLineOffset = 0) => {
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
        // Check if field and value are on the same line
        const match = lines[i].match(regex);
        const value = lines[i].replace(match[0], "").trim(); // Extract value after the match
        if (value) return cleanValue(value);
  
        // If no value on the same line, check next line
        return cleanValue(lines[i + nextLineOffset]);
      }
  }
  return "Not Found";
};

// Extract Multi-line Field
const extractMultiLineField = (lines, regex, startOffset = 0, multiLineLimit = 1) => {
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      let extractedValue = "";
      for (let j = 0; j < multiLineLimit; j++) {
        const nextLine = lines[i + startOffset + j];
        if (nextLine) {
          extractedValue += (extractedValue ? " " : "") + cleanValue(nextLine);
        }
      }
      return extractedValue || "Not Found";
    }
  }
  return "Not Found";
};

// Extract Exam Year
const extractExamYear = (lines) => {
  for (const line of lines) {
    const match = line.match(/PASSED SSC EXAMINATION held in (MARCH|APRIL)-?(\d{4})/i);
    if (match && match[2]) return match[2];
  }
  return "Not Found";
};

const extractDateOfBirth = (lines) => {
    for (let i = 0; i < lines.length; i++) {
      // Match DATE OF BIRTH on the current line
      if (/DATE OF BIRTH/i.test(lines[i])) {
        // Try to match the date on the same line
        const sameLineMatch = lines[i].match(/\d{2}\/\d{2}\/\d{4}/);
        if (sameLineMatch) return sameLineMatch[0];
  
        // If no date on the same line, check the next line
        if (lines[i + 1]) {
          const nextLineMatch = lines[i + 1].match(/\d{2}\/\d{2}\/\d{4}/);
          if (nextLineMatch) return nextLineMatch[0];
        }
      }
    }
    return "Not Found";
  };
  
//rollNumber

const extractRollNumber = (lines) => {
    for (let i = 0; i < lines.length; i++) {
      // Check if the current line contains "ROLL NO"
      if (/ROLL NO\./i.test(lines[i])) {
        // Check the next line for the roll number
        if (lines[i + 1]) {
          const nextLineMatch = lines[i + 1].match(/\d+/);
          if (nextLineMatch) return nextLineMatch[0];
        }
      }
    }
    return "Not Found";
  };
 
  const extractSameLine = (lines,regex) => {
    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        return lines[i] ; // The next line contains the father's name
      }
    }
    return "Not Found";
  }

//second line parsing
  const extractNextLine = (lines,regex) => {
    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        return lines[i + 1] ; // The next line contains the father's name
      }
    }
    return "Not Found";
  }
 
  const extractThirdLine = (lines,regex) => {
    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        return lines[i + 2] ; // The next line contains the father's name
      }
    }
    return "Not Found";
  }

 //fourth line parsing
 const extractFourthLine = (lines,regex) => {
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      return lines[i + 3] ; // The next line contains the father's name
    }
  }
  return "Not Found";
}  

// Clean Value Utility
const cleanValue = (value) => {
  return value
    ? value
        .replace(/^[,:\-]+|[,:\-]+$/g, "") // Remove leading/trailing colons, commas, or dashes
        .replace(/[^a-zA-Z0-9\s,.()\/-]/g, "") // Remove unwanted characters
        .trim()
    : "Not Found";
};

// Post-processing to Clean Parsed Data
const cleanData = (data) => {
  const cleaned = {};
  for (const key in data) {
    cleaned[key] = data[key]
      .replace(/^[,:\-]+|[,:\-]+$/g, "") // Remove leading/trailing colons, commas, or dashes
      .replace(/[^a-zA-Z0-9\s,.()\/-]/g, "") // Remove unwanted characters
      .trim();
  }
  return cleaned;
};

// Example Invocation
//extractDetailsFromMemo(filePath);

module.exports = { extractDetailsFromMemo };
