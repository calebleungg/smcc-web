class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
	devise :database_authenticatable, :registerable,
			:recoverable, :rememberable, :validatable

	has_one_attached :avatar
	has_many :member_posts

	def name
		return "#{self.first_name} #{self.last_name} "
	end

	def get_avatar
        return self.avatar.attached? ? self.avatar : "default-dp.png"
	end
end
