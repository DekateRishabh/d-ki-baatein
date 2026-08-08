type DividerProps = {
  label?: string;
};

export function Divider({ label }: DividerProps) {
  return (
    <div className="editorial-divider">{label && <span>{label}</span>}</div>
  );
}
