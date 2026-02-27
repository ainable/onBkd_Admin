import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import '../../style/order.css'
import { Button, Divider, QRCode } from "antd";
import { MdLocalPrintshop } from "react-icons/md";

const KOT = ({ data, handleCancel }) => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const componentRef = useRef(null);
    const now = new Date();

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
    });

    return (
        <div>
            <div ref={componentRef} className="bill-container print-area">
                <div className="kot_header_title">
                    <h4>BKD STORE KOT</h4>
                    <Divider dashed style={{ marginTop: "0" }} />
                </div>

                <div className="kot-details">
                    <p>Order No : <strong>{data.orderCode}</strong></p>
                    <p>Date : {now.toLocaleString()}</p>
                    <p>Customer Name : {data.userId?.fullName}</p>
                    <p>Mobile : {data.userId?.mobileNo}</p>
                </div>
                <div className="dashed" ></div>


                <div className="tables">
                    <div className="table_item">
                        <h6>QTY</h6>
                        <h6>ITEMS</h6>
                        <h6>MRP</h6>
                        <h6>AMT(RS)</h6>
                    </div>
                    <div className="dashed" ></div>

                    <div className="table_data">
                        {data.orderedProduct.map((cat) => (
                            <>
                                <p className="product_cat"> {capitalize(cat.itemCategoryName)}</p>
                                <div className="show_cat_product">
                                    {cat.products?.map((item, index) => (
                                        <div key={index}>
                                            <div>
                                                <p className="product_titles">{capitalize(item.productName)}</p>
                                                <div className="quantities">
                                                    <div className="qtys">
                                                        <p className="product_titles">{item.offerProduct ? item.offerProductQuantity : item.quantity}</p>
                                                        <p className="product_titles">{item.offerProduct && item.soloProductQuantityWithOffer != 0 ? item.soloProductQuantityWithOffer : null}</p>
                                                    </div>
                                                    <div className="varient">
                                                        <p>{item.productPackSize}</p>
                                                    </div>
                                                    <div className="prices">
                                                        <p>{item.mrpPrice}</p>
                                                    </div>
                                                    <div className="Total_prices">
                                                        <p>{item.offerProduct ? item.offerProductPrice : item.productPrice}</p>
                                                        <p>{item.offerProduct && item.soloProductQuantityWithOffer != 0 ? item.productPrice : null}</p>
                                                    </div>
                                                </div>

                                                {item.offerProduct && (
                                                    <div className="offer_item">
                                                        <p className="product_titles">
                                                            Offer Item : {capitalize(item.offerProduct.productName)}
                                                        </p>
                                                        <p className="product_cat">
                                                            Category : {capitalize(item.offerProduct.categoryName)}
                                                        </p>
                                                        <div className="quantities">
                                                            <div className="qty">
                                                                <p>{item.offerProduct.quantity}</p>
                                                            </div>
                                                            <div className="prices">
                                                                <p>{item.offerProduct.mrpPrice}</p>
                                                            </div>
                                                            <div className="Total_prices">
                                                                <p>Free</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="dashed"></div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ))}
                    </div>
                </div>

                <div className="summary-kot">
                    <div className="dashed" ></div>
                    <p>Total no. of items : <strong>{data.totalItems} </strong> items</p>
                    <p>Total no. of Quantity :<strong>{data.totalPices}</strong>  Qty. </p>
                    <p>MRP Total : ₹{data.mrpTotalProductAmount}</p>
                    <p>Sub Total : ₹{data.totalProductAmount}</p>
                    <p>Delivery Charge : ₹{data.deliveryCharge}</p>
                    <strong> Total Payable Amount : ₹{data.totalPayableAmount}</strong>
                    <p>Total saving : <strong>₹{data.totalSaving}</strong></p>
                </div>
                <div className="dashed" ></div>
                <div className="dashed" ></div>
                <div className="picker_details">
                    <p>Picker Name : _ _ _ _ _ _ _ _ _ _ _ _ </p>
                    <p>Packer Name : _ _ _ _ _ _ _ _ _ _ _ _ </p>
                    <p>Remark      : _ _ _ _ _ _ _ _ _ _ _ _ </p>
                </div>
                <div className="show_qr_info">
                    <QRCode value={data?.orderCode} size={120} />
                </div>
                <Divider dashed />
                <div className="footer">
                    <p>THANKS FOR SHOPPING WITH US.</p>
                </div>
            </div >
            <div className="kot_actin_btn">
                <Button onClick={handleCancel} danger>Cancel</Button>
                <Button
                    style={{ backgroundColor: "#2671eb" }}
                    icon={<MdLocalPrintshop />}
                    onClick={handlePrint}
                >
                    Print kot
                </Button>
            </div>
        </div >
    );
};

export default KOT;
