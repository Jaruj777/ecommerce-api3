import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//virtuals
//Виртуальные свойства — это свойства, которые не сохраняются в записи, а вместо этого при выполнении запроса мы можем иметь эти данные в записи или документе.
//истек ли срок действия купона.
CouponSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});
CouponSchema.virtual("deysLeft").get(function () {
  //1000 -1s; 60 - 1min; 60 -1houer; 24- 1day
  const deysLeft =
    Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) +
    " " +
    "Days Left";
  return deysLeft;
});
//validation
//создать купон с датой окончания, которая меньше даты начала.
//Ну, мы можем использовать сторонний пакет под названием Express Validator, но мы собираемся использовать Mongoose.
//промежуточное ПО, чтобы сделать это, используя то, что называется периметром.(middleware validte)
CouponSchema.pre("validate", function (next) {
  if (this.endDate < this.startDate) {
    next(new Error("End date cannot be less than the start date"));
  }
  next();
});
CouponSchema.pre("validate", function (next) {
  if (this.startDate < Date.now()) {
    next(new Error("Start date cannot be less than today"));
  }
  next();
});
CouponSchema.pre("validate", function (next) {
  if (this.endDate < Date.now()) {
    next(new Error("End date cannot be less than today"));
  }
  next();
});
CouponSchema.pre("validate", function (next) {
  if (this.discount <= 0 || this.discount > 100) {
    next(new Error("Discount cannot be less than 0 or greater than 100"));
  }
  next();
});
const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;
