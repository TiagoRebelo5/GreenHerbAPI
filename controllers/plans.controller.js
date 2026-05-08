exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all plans" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create plans", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET plans by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update plans by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete plans by id " + req.params.id });
};