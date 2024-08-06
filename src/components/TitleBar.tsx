import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { Divider, Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const TitleBar = (props: { title: string; }) => {
  const pathname = usePathname();
  const splitedPath = pathname.split('/');
  const parentPath = splitedPath.slice(0, 2).join('/');

  return (
    <>
      <div className="flex justify-between">
        <span className="flex-none w-6">
          {splitedPath.length > 2 && <Link color="foreground" href={parentPath}>
            <ArrowUturnLeftIcon className="size-6" />
          </Link>}
        </span>
        <div className="text-center text-lg font-bold">{props.title}</div>
        <span className="flex-none w-6"></span>
      </div>
      <Divider className="my-4" />
    </>
  );
};

export default TitleBar;