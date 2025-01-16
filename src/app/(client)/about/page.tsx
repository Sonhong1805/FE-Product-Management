import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Container } from "react-bootstrap";

const Page = () => {
  return (
    <>
      {/* <Breadcrumb title="Liên hệ" href="/contact" /> */}
      <div className="bg-white">
        <Container>
          <h2 className="py-3">Giới thiệu</h2>
        </Container>
      </div>
      <div
        className="w-100 position-relative"
        style={{ height: "570px", zIndex: "-1" }}>
        <Image src={"/image/bg-about-us.jpg"} alt="about-us" priority fill />
        <Container
          className="position-absolute"
          style={{
            top: "100px",
            left: "200px",
            width: "600px",
          }}>
          <div className="fs-3 pb-3">
            Bộ sưu tập{" "}
            <strong>phụ kiện điện tử và các sản phẩm công nghệ khác</strong>
          </div>
          <div className="pb-3">
            Chất lượng là ưu tiên hàng đầu của chúng tôi, vì vậy bạn có thể yên
            tâm rằng bạn đang mua sắm những sản phẩm chính hãng và đáng tin cậy.
          </div>
          <Link href={"/contact"} className="btn btn-danger">
            Liên hệ ngay
          </Link>
        </Container>
      </div>
      <div className="bg-secondary-subtle pb-5">
        <Container
          className="d-grid grid-3 gap-4 position-relative"
          style={{ top: "-25px" }}>
          <div className="bg-body p-3 ">
            <figure>
              <Image
                src={"/image/responsive.jpg"}
                alt="responsive"
                width={117}
                height={117}
                priority
              />
            </figure>
            <strong className="pb-3 fw-bold">Đa dạng sản phẩm</strong>
            <div className="pb-3">
              Từ điện thoại thông minh, máy tính xách tay, phụ kiện điện tử đến
              thiết bị gia đình thông minh, chúng tôi đã tạo ra một bộ sưu tập
              đáng kinh ngạc để đáp ứng mọi nhu cầu của khách hàng.
            </div>
          </div>
          <div className="bg-body p-3">
            <figure>
              <Image
                src={"/image/seo.jpg"}
                alt="seo"
                width={117}
                height={117}
                priority
              />
            </figure>
            <strong className="pb-3 fw-bold">Mua sắm trực tuyến</strong>
            <div className="pb-3">
              Từ điện thoại thông minh, máy tính xách tay, phụ kiện điện tử đến
              thiết bị gia đình thông minh, chúng tôi đã tạo ra một bộ sưu tập
              đáng kinh ngạc để đáp ứng mọi nhu cầu của khách hàng.
            </div>
          </div>
          <div className="bg-body p-3">
            <figure>
              <Image
                src={"/image/uxui.jpg"}
                alt="uxui"
                width={117}
                height={117}
                priority
              />
            </figure>
            <strong className="pb-3 fw-bold">Cam kết chất lượng</strong>
            <div className="pb-3">
              Từ điện thoại thông minh, máy tính xách tay, phụ kiện điện tử đến
              thiết bị gia đình thông minh, chúng tôi đã tạo ra một bộ sưu tập
              đáng kinh ngạc để đáp ứng mọi nhu cầu của khách hàng.
            </div>
          </div>
        </Container>
        <div className="text-center pb-4">
          <h3 className="pb-3 fw-bold">Thành tựu tuyệt vời</h3>
          <div>
            Khám phá <strong>tận hưởng tiện lợi và sự đa dạng</strong> của mua
            sắm trực tuyến.
          </div>
        </div>
        <Container className="bg-danger d-grid grid-3 p-4">
          <div className="text-white text-center p-4">
            <h2 className="fw-bold">1,000+</h2>
            <div>Thương hiệu nổi tiếng</div>
          </div>
          <div className="text-white text-center p-4">
            <h2 className="fw-bold">95%</h2>
            <div>Khách hàng hoàn toàn hài lòng</div>
          </div>
          <div className="text-white text-center p-4">
            <h2 className="fw-bold">99+</h2>
            <div>Danh mục sản phẩm nổi bật</div>
          </div>
          <div className="text-white text-center p-4">
            <h2 className="fw-bold">131,000+</h2>
            <div>Đơn hàng đã được đặt</div>
          </div>
          <div className="text-white text-center p-4">
            <h2 className="fw-bold">200,000+</h2>
            <div>Sản phẩm công nghệ hàng đầu</div>
          </div>
          <div className="text-white text-center p-4">
            <h2 className="fw-bold">39%</h2>
            <div>Lợi nhuận hàng năm tăng trưởng</div>
          </div>
        </Container>
      </div>
      <div className="bg-body pt-4">
        <div className="text-center">
          <h3 className="pb-3 fw-bold">
            <span className="text-danger">10,000+</span> Trải nghiệm trực tuyến
          </h3>
          <div className="pb-4">
            Chất lượng sản phẩm, trải nghiệm mua sắm trực tuyến tiện lợi, dịch
            vụ chăm sóc khách hàng xuất sắc
          </div>
        </div>
        <Container className="d-grid grid-3 gap-4 pb-5">
          <div className="border text-center p-3">
            <figure className="">
              <Image
                src={"/image/user1.png"}
                alt="user1"
                width={80}
                height={80}
                priority
              />
            </figure>
            <div className="pt-3">
              “Sản phẩm tôi mua đến nhanh chóng và được đóng gói cẩn thận. Chất
              lượng sản phẩm vượt qua mong đợi của tôi và giá cả rất hợp lý. Tôi
              sẽ chắc chắn quay lại mua sắm ở đây trong tương lai.”
            </div>
            <div className="fw-bold pt-2">Trần Văn A</div>
            <div className="text-secondary">Khách hàng</div>
          </div>
          <div className="border text-center p-3">
            <figure className="">
              <Image
                src={"/image/user2.png"}
                alt="user2"
                width={80}
                height={80}
                priority
              />
            </figure>
            <div className="pt-3">
              “Sản phẩm tôi mua đến nhanh chóng và được đóng gói cẩn thận. Chất
              lượng sản phẩm vượt qua mong đợi của tôi và giá cả rất hợp lý. Tôi
              sẽ chắc chắn quay lại mua sắm ở đây trong tương lai.”
            </div>
            <div className="fw-bold pt-2">Trần Văn B</div>
            <div className="text-secondary">Khách hàng</div>
          </div>
          <div className="border text-center p-3">
            <figure className="">
              <Image
                src={"/image/user3.png"}
                alt="user3"
                width={80}
                height={80}
                priority
              />
            </figure>
            <div className="pt-3">
              “Sản phẩm tôi mua đến nhanh chóng và được đóng gói cẩn thận. Chất
              lượng sản phẩm vượt qua mong đợi của tôi và giá cả rất hợp lý. Tôi
              sẽ chắc chắn quay lại mua sắm ở đây trong tương lai.”
            </div>
            <div className="fw-bold pt-2">Trần Văn C</div>
            <div className="text-secondary">Khách hàng</div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Page;
