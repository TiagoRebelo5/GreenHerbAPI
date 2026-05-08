exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all tasks" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create tasks", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET tasks by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update tasks by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete tasks by id " + req.params.id });
};