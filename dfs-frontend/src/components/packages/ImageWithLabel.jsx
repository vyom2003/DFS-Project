import { Link } from "react-router-dom";
const backgroundLabelClassArray = [
  "bg-slate-800 text-white",
  "bg-zinc-800 text-white",
  "bg-red-600 text-white",
  "bg-orange-900 text-white",
  "bg-amber-800 text-white",
  "bg-lime-700 text-white",
  "bg-green-700 text-white",
  "bg-teal-700 text-white",
  "bg-cyan-700 text-white",
  "bg-sky-700 text-white",
  "bg-blue-700 text-white",
  "bg-indigo-700 text-white",
  "bg-violet-700 text-white",
  "bg-fuchsia-700 text-white",
  "bg-pink-800 text-white",
];

export const WORDMAP = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
  ' ': 0,
};

export const wordToNum = (word) =>
  word
    .split("")
    .splice(0, 10)
    .reduce((acc, curr) => acc + WORDMAP[curr.toUpperCase()], 0);

export const getLabelColorAndBackground = (label) =>
  backgroundLabelClassArray[wordToNum(label) % 15];

export const ImageWithLabel = ({ label }) => {
  return (
    <Link to={'/user/' + label} title={'ASDFASDF'} className="hover:text-white hover:no-underline">
    <div
      className={`w-8 h-8 bg-red-600 flex items-center justify-center rounded-full text-lg ${getLabelColorAndBackground(
        label
      )}`}
      title={label}
      alt={label}
    >
      {label[0].toUpperCase()}
    </div>
    </Link>
  );
};
