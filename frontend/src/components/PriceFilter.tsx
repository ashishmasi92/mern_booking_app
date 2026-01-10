type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

export default function PriceFilter({ selectedPrice, onChange }: Props) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-1">Max Price</h4>

      <select
        className="p-2 border rounded-md w-full"
        value={selectedPrice}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          onChange(e.target.value ? parseInt(e.target.value) : undefined);
        }}
      >
        <option value="">Select Max Price</option>
        {[50, 100, 200, 300, 500].map((price) => (
          <option value={price}>{price}</option>
        ))}
      </select>
    </div>
  );
}
