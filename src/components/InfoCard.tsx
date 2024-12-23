import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export const GithubIcon = ({ className }: { className?: string }) => {
  return <Image className={className} src="/images/github-mark-white.svg" alt="github" width={50} height={50} />;
};

const InfoCard = (props: {
  title: string;
  description: string;
  skills?: { frontend: string[] };
  github?: string;
  href: string;
}) => {
  return (
    <Card className="m-4 w-3/4">
      <CardHeader className="flex gap-3">{props.title}</CardHeader>
      <Divider />
      <CardBody>

        <div>{props.description}</div>
      </CardBody>
      <Divider />
      <CardBody>
        {props.skills && (
          <div>
            {props.skills.frontend.map((el) => (
              <Chip
                key={el}
                className="mx-1"
                color="primary"
                variant="dot"
              >
                {el}
              </Chip>
            ))}
          </div>
        )}
      </CardBody >
      <Divider />
      <CardFooter>
        {props.github && (
          <Link
            color="foreground"
            href={props.github}
            className="w-full text-left"
          >
            <GithubIcon className="inline size-6" />
          </Link>
        )}
        <Link
          color="foreground"
          href={props.href}
          className="w-full text-right"
        >
          <ArrowRightCircleIcon className="inline size-6" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default InfoCard;
