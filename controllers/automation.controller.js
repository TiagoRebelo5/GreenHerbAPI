exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all automation" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create automation", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET automation by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update automation by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete automation by id " + req.params.id });
};