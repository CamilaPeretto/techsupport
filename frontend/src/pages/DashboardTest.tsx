import DashboardLayout from "../components/layout/DashboardLayout";

const DashboardTest = () => {
  const role: "user" | "tech" | "admin" = "tech";

  return (
    <DashboardLayout role={role}>
      <div className="text-white">
        <h1>Dashboard Teste</h1>
        <p>Área de conteúdo principal do dashboard.</p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardTest;
