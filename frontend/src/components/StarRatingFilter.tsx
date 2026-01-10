
type Props = {
  selectedStars: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function StarRatingFilter({ selectedStars, onChange }: Props) {
  return (
    <div className="border-b border-slate-300 pb-2">
      <h4 className="text-md font-semibold mb-1">Property Rating</h4>
      {["5", "4", "3", "2", "1"].map((star, index) => {
        return (
          <label key={index} className="flex items-center space-x-1">
            <input
              type="checkbox"
              className="rounded"
              value={star}
              checked={selectedStars.includes(star)}
              onChange={onChange}
            />
            <span>{star} Stars</span>
          </label>
        );
      })}
    </div>
  );
}
