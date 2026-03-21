import { prisma } from "../utils/prisma";

export const getTasks = async (req: any, res: any) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status;

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id,
        title: { contains: search },
        completed: status ? status === "true" : undefined,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ msg: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: any, res: any) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        userId: req.user.id,
      },
    });

    res.json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ msg: "Failed to create task" });
  }
};

export const updateTask = async (req: any, res: any) => {
  try {
    const taskId = Number(req.params.id);
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title.trim(),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ msg: "Failed to update task" });
  }
};

export const deleteTask = async (req: any, res: any) => {
  try {
    const taskId = Number(req.params.id);

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ msg: "Deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ msg: "Failed to delete task" });
  }
};

export const toggleTask = async (req: any, res: any) => {
  try {
    const taskId = Number(req.params.id);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: !task.completed,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Toggle task error:", error);
    res.status(500).json({ msg: "Failed to toggle task" });
  }
};