function textToJson(text: string) {
  text = text.trim();

  text = text.replace(/^```json\n/, "").replace(/```$/, "");

  const jsonData = JSON.parse(text);

  return jsonData;
}

export default textToJson;
