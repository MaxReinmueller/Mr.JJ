module.exports = function(sequelize, DataTypes) {
  var Subject = sequelize.define("Subject", {
    // Giving the Subject model a name of type STRING
    name: DataTypes.STRING
  });

  Subject.associate = function(models) {
    // Associating Subject with Flashcard
    // When an Subject is deleted, also delete any associated Cards
    Subject.hasMany(models.Flashcard, {
      onDelete: "cascade"
    });
  };

  return Subject;
};
