export default function DashboardCard({ task }) {
  return (
    <div
      className={`p-4 rounded-xl shadow hover:shadow-lg transition-shadow bg-[var(--color-card)] cursor-pointer ${
        task.completed ? "opacity-50 line-through" : ""
      }`}
    >
      <h3 className="font-semibold text-lg">{task.title}</h3>
      <p className="text-[var(--color-muted)] mt-2">
        {task.completed ? "Completed ✅" : "Pending 🐾"}
      </p>

      <h3 className="font-semibold text-lg">{task.title}</h3>
      <p className="text-[var(--color-muted)] mt-2">
        {task.completed ? "Completed ✅" : "Pending 🐾"}
      </p>
      
    </div>

    
  );
}
