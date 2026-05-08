exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all alerts" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create alerts", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET alerts by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update alerts by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete alerts by id " + req.params.id });
};