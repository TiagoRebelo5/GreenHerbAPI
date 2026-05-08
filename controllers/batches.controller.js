exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all batches" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create batches", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET batches by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update batches by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete batches by id " + req.params.id });
};