exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all audit" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create audit", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET audit by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update audit by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete audit by id " + req.params.id });
};