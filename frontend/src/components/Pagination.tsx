export type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, pages, onPageChange }: Props) {
  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center">
      <ul className="flex border border-slate-300">
        {pageNumbers.map((num) => {
          return (
            <li className={`px-2 py-1 ${page === num ? "bg-gray-300" : ""}`}>
              <button
                onClick={() => {
                  onPageChange(num);
                }}
              >
                {num}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
