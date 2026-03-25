interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (nextPage: number) => void;
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
};
