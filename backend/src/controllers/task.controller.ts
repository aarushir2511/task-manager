import { prisma } from "../utils/prisma";

export const getTasks = async (req: any, res: any) => {
  const { page = 1, limit = 10, search = "", status } = req.query;

  const tasks = await prisma.task.findMany({
    where: {
      userId: req.user.id,
      title: { contains: search },
      completed: status ? status === "true" : undefined,
    },
    skip: (page - 1) * limit,
    take: Number(limit),
  });

  res.json(tasks);
};

export const createTask = async (req: any, res: any) => {
  const task = await prisma.task.create({
    data: { title: req.body.title, userId: req.user.id },
  });

  res.json(task);
};

export const updateTask = async (req: any, res: any) => {
  const task = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });

  res.json(task);
};

export const deleteTask = async (req: any, res: any) => {
  await prisma.task.delete({ where: { id: Number(req.params.id) } });
  res.json({ msg: "Deleted" });
};

export const toggleTask = async (req: any, res: any) => {
  const task = await prisma.task.findUnique({ where: { id: Number(req.params.id) } });

  const updated = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: { completed: !task?.completed },
  });

  res.json(updated);
};