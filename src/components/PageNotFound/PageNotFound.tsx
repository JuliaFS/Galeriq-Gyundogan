import { Link } from "react-router-dom";
import { Path } from "../../constants/constants";

const PageNotFound: React.FC = () => {
  return (
    <div className="bg-purple-100 w-full sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)] flex flex-col items-center">
      <p className="pt-8">Something went wrong...</p>
      <div className="p-2 whitespace-nowrap">
        <p className="inline-block px-2">Navigate to </p>
        <Link
          to={Path.Home}
          className="font-kalam bg-rainbow-gradient bg-clip-text text-transparent text-2xl"
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
