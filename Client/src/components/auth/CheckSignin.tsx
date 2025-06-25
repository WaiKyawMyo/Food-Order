import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "../../store";

type Icheck = {
  children: React.ReactNode;
};

function CheckSignin({ children }: Icheck) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth.adminInfo);
  useEffect(() => {
    setLoading(true);
    if (userInfo) {
      navigate("/home");
      setLoading(false);
    } else {
      navigate("/");
      setLoading(false);
    }
  }, [navigate, userInfo]);
  return (
    <>
      {loading ? (
        <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
          <div className="flex justify-center items-center mt-[50vh]">
            <div className="fas fa-circle-notch fa-spin fa-5x text-blue-600"></div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default CheckSignin;
