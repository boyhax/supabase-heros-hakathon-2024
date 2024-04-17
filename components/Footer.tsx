import Logos from "./Logos";

export default function () {
  return (
    <footer className="w-full border-t border-t-foreground/10 p-1 flex flex-row justify-center items-center text-center text-xs">
      <p className={"mx-2"}>Powered by </p>

      <Logos />
    </footer>
  );
}
