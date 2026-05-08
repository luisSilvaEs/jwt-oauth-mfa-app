/*
- This is what gives you database operations without writing any SQL.
- Gives you DB operations for free via Spring Data JPA
*/
package com.luissilvacoding.jwt_oauth_mfa_app.repository;

import com.luissilvacoding.jwt_oauth_mfa_app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
/*
 * Interface: A contract, you define the contract (what operations you need),
 * and Spring writes the actual database code for you behind the scenes. That's
 * the magic — you get save(), findById(), findByEmail()
 * and more without writing a single line of SQL or implementation code.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

}
