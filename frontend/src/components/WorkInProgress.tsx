const WorkInProgress = ({ pageName }: { pageName: string }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-5xl">🚧</div>
        <h1 className="text-2xl font-bold text-white">{pageName}</h1>
        <p className="text-gray-400 text-sm">This page is under construction</p>
      </div>
    </div>
  );
};

export default WorkInProgress;
