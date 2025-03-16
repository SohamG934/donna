import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Use Python child process for PDF extraction
export const extractTextFromPdf = async (pdfBuffer: Buffer): Promise<string> => {
  // Create a temporary file for the PDF
  const tempDir = os.tmpdir();
  const tempPdfPath = path.join(tempDir, `${Date.now()}.pdf`);
  const tempOutputPath = path.join(tempDir, `${Date.now()}.txt`);
  
  await fs.writeFile(tempPdfPath, pdfBuffer);
  
  // Create a Python script for text extraction
  const pythonScript = `
import sys
import PyPDF2

pdf_path = sys.argv[1]
output_path = sys.argv[2]

try:
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text() + "\\n\\n"
        
        with open(output_path, 'w', encoding='utf-8') as output_file:
            output_file.write(text)
    print("success")
except Exception as e:
    print(f"error: {str(e)}")
    sys.exit(1)
  `;
  
  const tempScriptPath = path.join(tempDir, `${Date.now()}_extract.py`);
  await fs.writeFile(tempScriptPath, pythonScript);
  
  return new Promise<string>((resolve, reject) => {
    const pythonProcess = spawn('python', [tempScriptPath, tempPdfPath, tempOutputPath]);
    
    let errorOutput = '';
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', async (code) => {
      try {
        // Clean up temporary script
        await fs.unlink(tempScriptPath);
        
        if (code === 0) {
          // Read the extracted text
          const extractedText = await fs.readFile(tempOutputPath, 'utf-8');
          
          // Clean up temporary files
          await fs.unlink(tempPdfPath);
          await fs.unlink(tempOutputPath);
          
          resolve(extractedText);
        } else {
          reject(new Error(`PDF extraction failed: ${errorOutput}`));
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const splitTextIntoChunks = async (text: string): Promise<string[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const chunks = await splitter.createDocuments([text]);
  return chunks.map(chunk => chunk.pageContent);
};

export const processPdf = async (pdfBuffer: Buffer): Promise<{
  fullText: string;
  chunks: string[];
}> => {
  try {
    const fullText = await extractTextFromPdf(pdfBuffer);
    const chunks = await splitTextIntoChunks(fullText);
    return { fullText, chunks };
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF file');
  }
};
