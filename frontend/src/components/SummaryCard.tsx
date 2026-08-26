interface SummaryCardProps {
  label: string;
  amount: number;
  color: "blue" | "green" | "red";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-red-700 border-red-200",
};

const SummaryCard = ({ label, amount, color }: SummaryCardProps) => {
  return (
    <div className={`p-5 rounded-lg border ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">
        {amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
      </p>
    </div>
  );
};

export default SummaryCard;
