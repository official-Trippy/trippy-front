
export const getByteLength = (str: string) => {
    let byteLength = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      byteLength += charCode > 127 ? 2 : 1;
    }
    return byteLength;
  };
