export function Table({ children }) {
  return (
    <table className="min-w-full table-auto border border-gray-200">
      {children}
    </table>
  );
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export function TableRow({ children }) {
  return <tr className="border-t border-gray-200">{children}</tr>;
}

export function TableHead({ children }) {
  return (
    <th className="text-left px-4 py-2 font-semibold text-sm text-gray-700">
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableCell({ children }) {
  return <td className="px-4 py-2 text-sm text-gray-800">{children}</td>;
}
