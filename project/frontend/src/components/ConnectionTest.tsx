import { useEffect, useState } from "react";

function ConnectionTest() {
  const [data, setData] = useState<{ message: string; status: string } | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/test");

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const converted = await response.json();

        setData(converted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data && (
        <>
          <p className="text-white">{data.message}</p>
          <p className="text-white">{data.status}</p>
        </>
      )}
    </div>
  );
}

export default ConnectionTest;
