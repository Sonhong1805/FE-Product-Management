import moment from "moment";
import Image from "next/image";
import React from "react";
import { BsStarFill } from "react-icons/bs";

const RatingItems = ({ currentItems }: { currentItems: IRating[] }) => {
  return (
    <div className="mb-2">
      {currentItems.map((rating: IRating) => (
        <div key={rating._id}>
          <div className="p-3 border-bottom" style={{ background: "#FFFFFF" }}>
            <div className="d-flex align-items-center gap-3">
              <div>
                <Image
                  src={"/image/avatar-default.png"}
                  alt={"avatar"}
                  width={53}
                  height={53}
                  quality={100}
                  priority={true}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="">
                <div>
                  {rating.user?.fullname} -{" "}
                  {moment(rating.createdAt).format("DD/MM/YYYY")}
                </div>
                <div>
                  {[...Array(rating.star)].map((_, index) => (
                    <BsStarFill color={"#FFE31A"} key={index} />
                  ))}
                </div>
              </div>
            </div>
            <div>{rating.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatingItems;
