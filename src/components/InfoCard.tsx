import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import Link from "next/link";
import { ReactNode } from "react";

const InfoCard = (props: { title: string, description: string; href: string; }) => {
  return (
    <Card className="m-4 w-3/4">
      <CardHeader className="flex gap-3">
        {props.title}
      </CardHeader>
      <Divider />
      <CardBody>
        {props.description}
      </CardBody>
      <Divider />
      <CardFooter>
        <Link color="foreground" href={props.href} className="w-full text-right">
          <ArrowRightCircleIcon className="inline size-6" />
        </Link>
      </CardFooter>
    </Card>)
    ;
};

export default InfoCard;