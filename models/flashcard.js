/* eslint-disable prettier/prettier */
/* eslint-disable indent */
module.exports = function(sequelize, DataTypes) {
    var Flashcard = sequelize.define("Flashcard", {
      question: {
        type: DataTypes.STRING,
        // allowNull: false,
        // allowNull: true,
        validate: {
          len: [1]
        }
      },
      answer: {
        type: DataTypes.TEXT,
        // allowNull: false,
        // allowNull: true,
        len: [1]
      }
    });
  
    Flashcard.associate = function(models) {
      // We're saying that a Flashcard should belong to a Subject
      // A Card can't be created without an Subject due to the foreign key constraint
      Flashcard.belongsTo(models.Subject, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  //
    return Flashcard;
  };
  