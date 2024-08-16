// api/todos.js

import cosmosSingleton from "@/lib/cosmos";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log(`trying to get todos.`);
  // return NextResponse.json({ text: "Hello" }, { status: 200 });
  await cosmosSingleton.initialize();
  const container = cosmosSingleton.getContainer();
  return NextResponse.json(container, { status: 200 });

  // if (container) {
  //   const { resources: todos } = await container.items
  //     .query("SELECT * from Todos")
  //     .fetchAll();
  //   return NextResponse.json(todos, { status: 200 });
  // } else {
  //   return NextResponse.json({ error: "Failed to get todos" }, { status: 500 });
  // }
}