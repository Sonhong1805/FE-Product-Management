export const convertFileList = (filesArray: File[]): FileList => {
  const dataTransfer = new DataTransfer();
  filesArray.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
};
