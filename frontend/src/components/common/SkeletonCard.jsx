export default function SkeletonCard({ count = 3, height = 200 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="col">
          <div className="card h-100">
            <div className="skeleton" style={{ height }} />
            <div className="card-body">
              <div className="skeleton mb-2" style={{ height: 20, width: '70%' }} />
              <div className="skeleton mb-2" style={{ height: 16, width: '50%' }} />
              <div className="skeleton" style={{ height: 16, width: '40%' }} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <table className="table">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: 5 }).map((__, j) => (
              <td key={j}><div className="skeleton" style={{ height: 20 }} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SkeletonStat({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="col">
          <div className="skeleton" style={{ height: 120, borderRadius: 16 }} />
        </div>
      ))}
    </>
  );
}
