
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const generateJavaSolution = async (
  problemDescription: string
): Promise<{ javaCode: string; explanation: string }> => {
  const prompt = `
    You are an expert Java programmer and a clear, concise teacher. Your task is to solve the following programming problem using basic Object-Oriented Programming (OOP) concepts and then explain the concepts used.

    Problem Statement:
    "${problemDescription} For this exercise, use a minimum wage of 1,300,000 pesos."

    Instructions:
    1.  Create a complete, runnable Java program that solves the problem. The code must be inside a single code block.
    2.  Define a 'Trabajador' (Worker) class.
        -   Include private attributes for: 'nombre' (name), 'apellido' (last name), 'documento' (document), 'salario' (salary), and 'bono' (bonus).
        -   Implement a constructor to initialize these attributes.
        -   Implement public getter and setter methods for all attributes to demonstrate encapsulation.
        -   Include a 'toString()' method to display worker information easily.
    3.  Define a 'Principal' (Main) class with a 'main' method.
        -   Inside 'main', define a constant for the base bonus (e.g., 'BONO_BASE = 200,000').
        -   Define a constant for the minimum wage (e.g., 'SALARIO_MINIMO = 1,300,000').
        -   Create a list (e.g., 'ArrayList') of 4 'Trabajador' objects with sample data. Initialize each worker with the 'BONO_BASE'.
        -   Print the initial state of each worker using a title like "--- Estado Inicial de los Trabajadores ---".
        -   Iterate through the list of workers and apply the bonus logic:
            -   If 'salario < SALARIO_MINIMO', update the bonus to 'BONO_BASE + 100,000'.
            -   If 'salario >= SALARIO_MINIMO', update the bonus to 'BONO_BASE + 50,000'.
        -   Print the final state of each worker using a title like "--- Estado Final con Bonos Actualizados ---".
    4.  After the Java code, provide a detailed explanation in Spanish of the OOP concepts applied in the solution. Structure the explanation with the following headings as bolded text:
        -   **Clase (Class)**
        -   **Objeto (Object)**
        -   **Constructor**
        -   **Encapsulamiento (Encapsulation)**
        -   **Getters y Setters**
    5.  Return the final output as a single, valid JSON object with two keys: "javaCode" and "explanation". The "javaCode" key should contain the full Java code as a single string, and the "explanation" key should contain the full explanation as a single string. Do not include markdown backticks for the code in the JSON value.
    `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });
    
    const text = response.text.trim();
    const parsedResponse = JSON.parse(text);

    if (parsedResponse.javaCode && parsedResponse.explanation) {
      return parsedResponse;
    } else {
      throw new Error("Invalid JSON structure from API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the Gemini API.");
  }
};
