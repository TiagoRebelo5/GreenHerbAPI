exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all reports" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create reports", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET reports by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update reports by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete reports by id " + req.params.id });
};