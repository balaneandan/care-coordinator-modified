export default function Dashboard({ params }: { params: { userId: string } }) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to your dashboard </h1>
        <p>User ID: <strong>{params.userId}</strong></p>
        <p>You are now logged in.</p>
      </div>
    );
  }
  