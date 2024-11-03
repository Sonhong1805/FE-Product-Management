import chroma from "chroma-js";
import { StylesConfig } from "react-select";

export const colourStyles: StylesConfig<Option, true> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = data.color ? chroma(data.color) : chroma("#000");
    const isWhite = color.hex() === "#FFFFFF";

    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : isWhite
        ? "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = data.color ? chroma(data.color) : chroma("#000");
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color === "#FFFFFF" ? "black" : data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color === "#FFFFFF" ? "black" : data.color,
    ":hover": {
      backgroundColor: data.color,
      color: data.color === "#FFFFFF" ? "black" : "white",
    },
  }),
};
