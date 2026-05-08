exports.getAll = (req, res) => {
    res.status(200).json({ message: "GET all herbs" });
};

exports.create = (req, res) => {
    res.status(201).json({ message: "Create herbs", data: req.body });
};

exports.getById = (req, res) => {
    res.status(200).json({ message: "GET herbs by id " + req.params.id });
};

exports.update = (req, res) => {
    res.status(200).json({ message: "Update herbs by id " + req.params.id });
};

exports.delete = (req, res) => {
    res.status(200).json({ message: "Delete herbs by id " + req.params.id });
};