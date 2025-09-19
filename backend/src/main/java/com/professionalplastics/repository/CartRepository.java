package com.professionalplastics.repository;

import com.professionalplastics.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.productPrice pp " +
           "LEFT JOIN FETCH pp.productDetail pd " +
           "LEFT JOIN FETCH pd.grade g " +
           "LEFT JOIN FETCH pp.thickness t " +
           "LEFT JOIN FETCH pp.size s " +
           "ORDER BY c.id")
    List<Cart> findAllWithProductDetails();

    @Query("SELECT c FROM Cart c WHERE c.productPrice.id = :productPriceId")
    Cart findByProductPriceId(@Param("productPriceId") Long productPriceId);

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.productPrice WHERE c.id = :id")
    Optional<Cart> findByIdWithProductPrice(@Param("id") Long id);

    @Query("SELECT SUM(c.totalPrice) FROM Cart c")
    BigDecimal getTotalCartValue();
}
