export const validateHeight = (value: string): string => {
  if (!/^\d+$/.test(value)) return "数値で入力してください。";
  const num = parseInt(value, 10);
  if (num < 100 || num > 250)
    return "身長は100cm〜250cmの範囲で入力してください。";
  return "";
};

export const validateWeight = (value: string): string => {
  if (!/^\d+$/.test(value)) return "数値で入力してください。";
 const num = parseFloat(value);
  if (num < 30 || num > 200)
    return "目標体重は30kg〜200kgの範囲で入力してください。";
  return "";
};

export const validateBodyFat = (value: string): string => {
  if (!/^\d+(\.\d+)?$/.test(value)) return "数値で入力してください。";
  const num = parseFloat(value);
  if (num < 5 || num > 60)
    return "体脂肪率は5%〜60%の範囲で入力してください。";
  return "";
};