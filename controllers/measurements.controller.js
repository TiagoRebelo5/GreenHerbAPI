exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all measurements" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create measurements", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET measurements by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update measurements by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete measurements by id " + req.params.id });
};