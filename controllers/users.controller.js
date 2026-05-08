exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all users" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create users", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET users by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update users by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete users by id " + req.params.id });
};