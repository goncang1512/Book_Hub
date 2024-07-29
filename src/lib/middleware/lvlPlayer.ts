export class Player {
  level: number;
  experience: number;
  levelUp: {
    status: boolean;
    message: string;
  };
  constructor(lvlPlayer: number, expPlayer: number) {
    this.level = lvlPlayer;
    this.experience = expPlayer;
    this.levelUp = {
      status: false,
      message: "",
    };
  }

  gainExperience(exp: number) {
    this.experience += exp;
    this.checkLevelUp();
  }

  checkLevelUp() {
    let levelUpExperience = this.level * 100;
    while (this.experience >= levelUpExperience) {
      this.level++;
      this.experience -= levelUpExperience;
      levelUpExperience = this.level * 100;
      this.levelUp = {
        status: true,
        message: `Congratulations! You've reached level ${this.level}!`,
      };
    }
  }
}
