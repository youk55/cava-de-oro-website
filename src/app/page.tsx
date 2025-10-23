'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface CartItem {
  id: string
  name: string
  nameZh: string
  price: number
  quantity: number
  image: string
}

interface ProductData {
  id: string
  name: string
  nameZh: string
  image: string
  description: string
  descriptionZh: string
  alcoholContent: string
  aging: string
  agingZh: string
  volume: string
  nom: string
  region: string
  regionZh: string
  distillery: string
  distilleryZh: string
  tastingNotes: string[]
  tastingNotesZh: string[]
  productionDetails: string
  productionDetailsZh: string
  price: string
}

interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  notes: string
}

const translations = {
  english: {
    nav: {
      home: 'HOME',
      about: 'ABOUT US',
      cava: 'CAVA DE ORO',
      work: 'OUR WORK',
      contact: 'CONTACT US'
    },
    hero: {
      subtitle: '100% De Agave',
      title: 'Cava de Oro',
      description: 'A NEW PREMIUM TEQUILA',
      tagline: 'Sabor a Tradición'
    },
    about: {
      title: 'ABOUT US',
      intro1: '"Cava de Oro" - Now available in Singapore.',
      intro2: 'Surprise, Emotional, Extra quality, Beatitude, Fine flavor.',
      intro3: 'These words are suitable for the "Premium Tequila" - The name is "Cava de Oro".',
      description: 'Only tequila made from 100% agave azul raw materials is allowed to be called "premium tequila". There is always a notation such as "100% de Agave" on the bottle. The director of the Tequila Museum, which is located in Mexico, known as the home of tequila, where hundreds of types of tequila can be displayed and tasted, "Cave de Oro" is the tequila that has been praised as "the smoothest, mildest and most delicious mouthfeel". This tequila with a completely new mellow aroma and luxurious sweetness that overturns the common sense of tequila, it will surely attract high-end Singapore adults who are used to playing.'
    },
    work: {
      title: 'OUR WORK',
      description1: 'Cava de Oro is aged in barrel since 2000. Its history goes back to the era of craftmaker of tequila.',
      description2: 'The stillroom for Cava de Oro located not far from the tequila villages of the Valles region. It\'s a very traditional tequila-brewing region lasted from the 1700s.',
      description3: 'Currently, a series of distillation facilities and agave fields are also designated as "World Heritage Sites". In that area are, there are many tequila distilleries like any other mega-factories. The owner himself is involved in the entire process from harvesting the raw material agave to completion. It is possible because it is a family business with a proven track record to create the precise and delicate taste that has been handed down.'
    },
    contact: {
      title: 'CONTACT US',
      phone: 'Tel: +65 86895869',
      description1: 'Contact us via WhatsApp for faster response, or fill out the form below.',
      description2: 'We\'ll get back to you as soon as possible.',
      whatsapp: 'Contact via WhatsApp',
      whatsappTitle: 'Contact via WhatsApp',
      whatsappDesc: 'Click the button below to send a message on WhatsApp',
      contactNumber: 'Contact Number',
      scanQR: 'Scan QR Code to Chat',
      messageWhatsApp: 'Message on WhatsApp',
      call: 'Call +65 86895869'
    },
    products: {
      viewDetails: 'View Details',
      addToCart: 'Add to Cart',
      downloadCatalog: 'Download Catalog',
      basicInfo: 'Basic Information',
      alcoholContent: 'Alcohol Content',
      aging: 'Aging',
      volume: 'Volume',
      origin: 'Origin',
      region: 'Region',
      distillery: 'Distillery',
      price: 'Price',
      tastingNotes: 'Tasting Notes',
      productionDetails: 'Production Details'
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      quantity: 'Quantity',
      remove: 'Remove',
      total: 'Total',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      grandTotal: 'Grand Total',
      checkout: 'Proceed to Checkout',
      addToCart: 'Add to Cart',
      continueShopping: 'Continue Shopping',
      paypal: 'Pay with PayPal',
      paynow: 'Pay with PayNow',
      orderComplete: 'Order Complete',
      backToShopping: 'Back to Shopping',
      emailSent: 'Order confirmation email sent!',
      emailError: 'Failed to send email. Please contact us directly.'
    },
    checkout: {
      title: 'Checkout',
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      shippingAddress: 'Shipping Address',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country',
      notes: 'Order Notes (Optional)',
      paymentMethod: 'Payment Method',
      completeOrder: 'Complete Order',
      processing: 'Processing...',
      requiredField: 'This field is required'
    }
  },
  chinese: {
    nav: {
      home: '首页',
      about: '关于我们',
      cava: '金窖龙舌兰',
      work: '我们的工作',
      contact: '联系我们'
    },
    hero: {
      subtitle: '100% 龙舌兰',
      title: 'Cava de Oro',
      description: '全新高端龙舌兰酒',
      tagline: '传统之味'
    },
    about: {
      title: '关于我们',
      intro1: '"Cava de Oro" - 现已在新加坡上市。',
      intro2: '惊喜、情感、极致品质、至福、绝佳风味。',
      intro3: '这些词汇完美诠释了"高端龙舌兰酒" - 其名为"Cava de Oro"。',
      description: '只有采用100%蓝色龙舌兰原料制成的龙舌兰酒才能被称为"高端龙舌兰酒"。酒瓶上总是标有"100% de Agave"的字样。位于墨西哥这个龙舌兰酒故乡的龙舌兰酒博物馆，展示和品尝数百种龙舌兰酒，该博物馆馆长盛赞"Cava de Oro"是"口感最顺滑、最温和、最美味的佳品"。这款龙舌兰酒拥有全新的醇厚香气和奢华甜味，颠覆了人们对龙舌兰酒的常规认知，必将吸引习惯于享受高品质生活的新加坡成年人。'
    },
    work: {
      title: '我们的工作',
      description1: 'Cava de Oro自2000年起开始在橡木桶中陈酿。其历史可以追溯到龙舌兰酒工匠时代。',
      description2: 'Cava de Oro的蒸馏厂位于巴列斯地区龙舌兰村庄附近。这是一个从1700年代延续至今的传统龙舌兰酒酿造地区。',
      description3: '目前，一系列蒸馏设施和龙舌兰田已被指定为"世界遗产"。在该地区，有许多像其他大型工厂一样的龙舌兰酒蒸馏厂。业主亲自参与从收获龙舌兰原料到完成的整个过程。这之所以成为可能，是因为这是一个具有经过验证的传统记录的家族企业，能够创造出传承至今的精确而精致的口味。'
    },
    contact: {
      title: '联系我们',
      phone: '电话：+65 86895869',
      description1: '通过WhatsApp联系我们以获得更快回复，或填写下方表单。',
      description2: '我们会尽快回复您。',
      whatsapp: '通过WhatsApp联系',
      whatsappTitle: '通过WhatsApp联系',
      whatsappDesc: '点击下方按钮发送WhatsApp消息',
      contactNumber: '联系电话',
      scanQR: '扫描二维码聊天',
      messageWhatsApp: '发送WhatsApp消息',
      call: '拨打 +65 86895869'
    },
    products: {
      viewDetails: '查看详情',
      addToCart: '加入购物车',
      downloadCatalog: '下载目录',
      basicInfo: '基本信息',
      alcoholContent: '酒精含量',
      aging: '陈酿时间',
      volume: '容量',
      origin: '产地',
      region: '地区',
      distillery: '蒸馏厂',
      price: '价格',
      tastingNotes: '品鉴笔记',
      productionDetails: '生产详情'
    },
    cart: {
      title: '购物车',
      empty: '您的购物车是空的',
      quantity: '数量',
      remove: '移除',
      total: '总计',
      subtotal: '小计',
      shipping: '运费',
      grandTotal: '合计',
      checkout: '前往结账',
      addToCart: '加入购物车',
      continueShopping: '继续购物',
      paypal: '使用PayPal支付',
      paynow: '使用PayNow支付',
      orderComplete: '订单完成',
      backToShopping: '返回购物',
      emailSent: '订单确认邮件已发送！',
      emailError: '邮件发送失败。请直接联系我们。'
    },
    checkout: {
      title: '结账',
      personalInfo: '个人信息',
      firstName: '名',
      lastName: '姓',
      email: '电子邮件',
      phone: '电话',
      shippingAddress: '配送地址',
      address: '地址',
      city: '城市',
      postalCode: '邮政编码',
      country: '国家',
      notes: '订单备注（可选）',
      paymentMethod: '支付方式',
      completeOrder: '完成订单',
      processing: '处理中...',
      requiredField: '此字段为必填项'
    }
  }
}

const productData: ProductData[] = [
  {
    id: 'anejo',
    name: 'TEQUILA AÑEJO',
    nameZh: '陈酿龙舌兰酒',
    image: 'https://ext.same-assets.com/297100652/2889512519.jpeg',
    description: 'Aged for 2 years. Soft with notes of fruit and toasted barrel aromas. Fresh texture and a pleasant sweetness.',
    descriptionZh: '陈酿2年。柔和的水果香气和烘烤橡木桶香味。口感清新，带有怡人的甜味。',
    alcoholContent: '40%',
    aging: 'Aged for 2 years',
    agingZh: '陈酿2年',
    volume: '750ml',
    nom: '1477',
    region: 'Los Altos de Jalisco',
    regionZh: '哈利斯科高地',
    distillery: 'Tequilera Puerta de Hierro S.A de C.V',
    distilleryZh: '铁门龙舌兰酒厂有限公司',
    tastingNotes: ['Vanilla', 'Caramel', 'Oak', 'Honey', 'Spice'],
    tastingNotesZh: ['香草', '焦糖', '橡木', '蜂蜜', '香料'],
    productionDetails: 'Aged in American oak barrels for a minimum of 2 years. Made with 100% blue agave using traditional methods.',
    productionDetailsZh: '在美国橡木桶中陈酿至少2年。采用传统工艺，100%蓝色龙舌兰制作。',
    price: 'S$150'
  },
  {
    id: 'extra-anejo',
    name: 'TEQUILA EXTRA AÑEJO',
    nameZh: '特级陈酿龙舌兰酒',
    image: 'https://ext.same-assets.com/297100652/3348755416.jpeg',
    description: 'Aged for 5 years. With toasted barrel aromas. Full-bodied with notes of cassis and berries, exquisite vanilla and caramel sweetness.',
    descriptionZh: '陈酿5年。带有烘烤橡木桶香气。酒体饱满，带有黑醋栗和浆果香味，精致的香草和焦糖甜味。',
    alcoholContent: '40%',
    aging: 'Aged for 5 years',
    agingZh: '陈酿5年',
    volume: '750ml',
    nom: '1477',
    region: 'Los Altos de Jalisco',
    regionZh: '哈利斯科高地',
    distillery: 'Tequilera Puerta de Hierro S.A de C.V',
    distilleryZh: '铁门龙舌兰酒厂有限公司',
    tastingNotes: ['Dark Chocolate', 'Dried Fruits', 'Leather', 'Tobacco', 'Premium Oak'],
    tastingNotesZh: ['黑巧克力', '干果', '皮革', '烟草', '优质橡木'],
    productionDetails: 'Aged in French oak barrels for 5 years. Uses only the finest quality agave, aged in specially selected barrels by master distillers.',
    productionDetailsZh: '在法国橡木桶中陈酿5年。仅使用最优质的龙舌兰，由酿酒大师精选橡木桶陈酿。',
    price: 'S$215'
  },
  {
    id: 'cristalino',
    name: 'TEQUILA AÑEJO CRISTALINO',
    nameZh: '陈酿水晶龙舌兰酒',
    image: 'https://ext.same-assets.com/297100652/3761294050.jpeg',
    description: 'Aged for 2 years/filtered 7 times. Fruity notes with smoky notes of roasted oak. Smooth taste creates a full-bodied, long aftertaste.',
    descriptionZh: '陈酿2年/7次过滤。带有水果香味和烘烤橡木的烟熏味。口感顺滑，酒体饱满，余味悠长。',
    alcoholContent: '40%',
    aging: 'Aged for 2 years + Cristalino process',
    agingZh: '陈酿2年 + 水晶工艺',
    volume: '750ml',
    nom: '1477',
    region: 'Los Altos de Jalisco',
    regionZh: '哈利斯科高地',
    distillery: 'Tequilera Puerta de Hierro S.A de C.V',
    distilleryZh: '铁门龙舌兰酒厂有限公司',
    tastingNotes: ['Fresh Agave', 'Citrus', 'Vanilla', 'Mineral', 'Smooth Finish'],
    tastingNotesZh: ['新鲜龙舌兰', '柑橘', '香草', '矿物', '顺滑余味'],
    productionDetails: 'After 2 years of aging, special activated carbon filtering removes color while retaining the aged flavor profile.',
    productionDetailsZh: '经过2年陈酿后，特殊活性炭过滤去除色素，同时保留陈酿风味特征。',
    price: 'S$645'
  },
  {
    id: 'black-edition',
    name: 'BLACK EDITION',
    nameZh: '黑标限定版',
    image: 'https://ext.same-assets.com/297100652/802937699.jpeg',
    description: 'Rare Extra Añejo, limited to 1,000 bottles worldwide, created to commemorate the brand\'s 20th anniversary. Available exclusively in Singapore outside of Mexico.',
    descriptionZh: '稀有特级陈酿，全球限量1000瓶，为纪念品牌20周年而创制。除墨西哥外仅在新加坡独家发售。',
    alcoholContent: '40%',
    aging: '20+ years ultra-premium aging',
    agingZh: '20年以上超高端陈酿',
    volume: '750ml',
    nom: '1477',
    region: 'Los Altos de Jalisco',
    regionZh: '哈利斯科高地',
    distillery: 'Tequilera Puerta de Hierro S.A de C.V',
    distilleryZh: '铁门龙舌兰酒厂有限公司',
    tastingNotes: ['Rich Caramel', 'Premium Chocolate', 'Espresso', 'Luxurious Oak', 'Long Finish'],
    tastingNotesZh: ['浓郁焦糖', '顶级巧克力', '浓缩咖啡', '奢华橡木', '悠长余味'],
    productionDetails: 'Limited to 1,000 bottles annually. Over 20 years of ultra-premium aging creates the ultimate tequila experience beyond conventional concepts.',
    productionDetailsZh: '年产限量1000瓶。超过20年的超高端陈酿，创造出超越传统概念的终极龙舌兰体验。',
    price: 'S$1840'
  },
  {
    id: 'mini-collection',
    name: 'MINI BOTTLE COLLECTION',
    nameZh: '迷你酒瓶套装',
    image: 'https://ext.same-assets.com/297100652/3519823886.jpeg',
    description: 'An assortment of three popular varieties: Añejo, Extra Añejo, and Cristalino in 50ml bottles for tasting.',
    descriptionZh: '三种人气品种组合：陈酿、特级陈酿和水晶龙舌兰酒50ml装品鉴套装。',
    alcoholContent: '40%',
    aging: 'Mixed aging (2yr/5yr/2yr Cristalino)',
    agingZh: '混合陈酿（2年/5年/2年水晶）',
    volume: '50ml × 3 bottles',
    nom: '1477',
    region: 'Los Altos de Jalisco',
    regionZh: '哈利斯科高地',
    distillery: 'Tequilera Puerta de Hierro S.A de C.V',
    distilleryZh: '铁门龙舌兰酒厂有限公司',
    tastingNotes: ['Distinctive flavors of each variety', 'Perfect for tasting comparison', 'Popular gift option'],
    tastingNotesZh: ['各品种独特风味', '品鉴比较完美选择', '热门礼品选择'],
    productionDetails: 'Premium set featuring Cava de Oro\'s three signature varieties in small portions. Perfect for tasting and gifts.',
    productionDetailsZh: 'Cava de Oro三种招牌品种小包装高端套装。品鉴和送礼的完美选择。',
    price: 'S$210'
  }
]

export default function Home() {
  const { toast } = useToast()
  const [scrolled, setScrolled] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [language, setLanguage] = useState<'english' | 'chinese'>('english')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    notes: ''
  })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paynow' | 'paypal'>('paynow')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'none' | 'sending' | 'sent' | 'error'>('none')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartAnimation, setCartAnimation] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleProductClick = (product: ProductData) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const addToCart = (product: ProductData) => {
    const price = parseFloat(product.price.replace('S$', ''))
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      nameZh: product.nameZh,
      price: price,
      quantity: 1,
      image: product.image
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        setTimeout(() => {
          toast({
            title: language === 'english' ? '✓ Added to Cart' : '✓ 已加入购物车',
            description: language === 'english'
              ? `${product.name} quantity increased`
              : `${product.nameZh} 数量已增加`,
            duration: 2000,
          })
        }, 0)
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      setTimeout(() => {
        toast({
          title: language === 'english' ? '✓ Added to Cart' : '✓ 已加入购物车',
          description: language === 'english'
            ? `${product.name} has been added to your cart`
            : `${product.nameZh} 已加入您的购物车`,
          duration: 2000,
        })
      }, 0)
      return [...prevCart, cartItem]
    })

    // Cart icon animation
    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 600)
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getShippingCost = () => {
    return cart.length > 0 ? 20 : 0
  }

  const getTotalPrice = () => {
    return (getSubtotal() + getShippingCost()).toFixed(2)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const sendOrderEmail = async (orderData: CheckoutForm) => {
    try {
      setEmailStatus('sending')
      emailjs.init("YOUR_PUBLIC_KEY")

      const emailParams = {
        to_email: 'order@yoload.asia',
        from_name: `${orderData.firstName} ${orderData.lastName}`,
        from_email: orderData.email,
        customer_phone: orderData.phone,
        customer_address: `${orderData.address}, ${orderData.city}, ${orderData.postalCode}, ${orderData.country}`,
        order_notes: orderData.notes,
        order_items: cart.map(item =>
          `${language === 'english' ? item.name : item.nameZh} x${item.quantity} - S$${(item.price * item.quantity).toFixed(2)}`
        ).join('\n'),
        subtotal: `S$${getSubtotal().toFixed(2)}`,
        shipping: `S$${getShippingCost().toFixed(2)}`,
        total_amount: `S$${getTotalPrice()}`,
        payment_method: selectedPaymentMethod === 'paynow' ? 'PayNow' : 'PayPal',
        order_date: new Date().toLocaleString()
      }

      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailParams)
      setEmailStatus('sent')
    } catch (error) {
      console.error('Failed to send order email:', error)
      setEmailStatus('error')
    }
  }

  const handleCheckoutFormChange = (field: keyof CheckoutForm, value: string) => {
    setCheckoutForm(prev => ({ ...prev, [field]: value }))
  }

  const validateCheckoutForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'country']
    return required.every(field => checkoutForm[field as keyof CheckoutForm].trim() !== '')
  }

  const handleCompleteOrder = async () => {
    if (!validateCheckoutForm()) {
      alert(translations[language].checkout.requiredField)
      return
    }

    setIsProcessing(true)

    try {
      await sendOrderEmail(checkoutForm)
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (selectedPaymentMethod === 'paynow') {
        alert(`PayNow Payment\nAmount: S$${getTotalPrice()}\n\nPlease scan the QR code with your banking app to complete payment.`)
      } else {
        handlePayPalPayment()
      }

      setOrderComplete(true)
      setCart([])
    } catch (error) {
      console.error('Order processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayPalPayment = () => {
    const amount = getTotalPrice()
    const items = cart.map(item => `${language === 'english' ? item.name : item.nameZh} x${item.quantity}`).join(', ')
    alert(`PayPal Payment\nAmount: S$${amount}\nItems: ${items}\n\nRedirecting to PayPal for secure payment...`)
  }

  const resetCheckout = () => {
    setIsCheckoutOpen(false)
    setOrderComplete(false)
    setEmailStatus('none')
    setCheckoutForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      notes: ''
    })
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="https://ext.same-assets.com/297100652/2534944669.png"
                alt="Cava de Oro"
                width={120}
                height={60}
                className="h-10 md:h-12 w-auto"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="#home" className="text-white hover:text-amber-400 transition-colors text-sm font-light tracking-wider">{translations[language].nav.home}</a>
              <a href="#about" className="text-white hover:text-amber-400 transition-colors text-sm font-light tracking-wider">{translations[language].nav.about}</a>
              <a href="#cava" className="text-white hover:text-amber-400 transition-colors text-sm font-light tracking-wider">{translations[language].nav.cava}</a>
              <a href="#work" className="text-white hover:text-amber-400 transition-colors text-sm font-light tracking-wider">{translations[language].nav.work}</a>
              <a href="#contact" className="text-white hover:text-amber-400 transition-colors text-sm font-light tracking-wider">{translations[language].nav.contact}</a>

              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative text-white hover:text-amber-400 transition-all text-sm font-light tracking-wider ${
                  cartAnimation ? 'scale-125 animate-bounce' : 'scale-100'
                }`}
              >
                🛒 ({getTotalItems()})
              </button>

              <button
                onClick={() => setLanguage('english')}
                className={`text-sm font-light tracking-wider transition-colors ${language === 'english' ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}
              >
                ENGLISH
              </button>
              <button
                onClick={() => setLanguage('chinese')}
                className={`text-sm font-light tracking-wider transition-colors ${language === 'chinese' ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}
              >
                中文
              </button>
            </div>

            {/* Mobile Menu Controls */}
            <div className="lg:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative text-white hover:text-amber-400 transition-all text-lg ${
                  cartAnimation ? 'scale-125 animate-bounce' : 'scale-100'
                }`}
              >
                🛒 <span className="text-xs">({getTotalItems()})</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-amber-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-white/20">
              <div className="flex flex-col space-y-4 pt-4">
                <a
                  href="#home"
                  className="text-white hover:text-amber-400 transition-colors text-base font-light tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {translations[language].nav.home}
                </a>
                <a
                  href="#about"
                  className="text-white hover:text-amber-400 transition-colors text-base font-light tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {translations[language].nav.about}
                </a>
                <a
                  href="#cava"
                  className="text-white hover:text-amber-400 transition-colors text-base font-light tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {translations[language].nav.cava}
                </a>
                <a
                  href="#work"
                  className="text-white hover:text-amber-400 transition-colors text-base font-light tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {translations[language].nav.work}
                </a>
                <a
                  href="#contact"
                  className="text-white hover:text-amber-400 transition-colors text-base font-light tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {translations[language].nav.contact}
                </a>

                <div className="flex space-x-4 pt-2 border-t border-white/20">
                  <button
                    onClick={() => {setLanguage('english'); setIsMobileMenuOpen(false);}}
                    className={`text-base font-light tracking-wider transition-colors ${language === 'english' ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}
                  >
                    ENGLISH
                  </button>
                  <button
                    onClick={() => {setLanguage('chinese'); setIsMobileMenuOpen(false);}}
                    className={`text-base font-light tracking-wider transition-colors ${language === 'chinese' ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}
                  >
                    中文
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-black/70 z-10"></div>
        <Image
          src="https://ext.same-assets.com/297100652/2869755863.jpeg"
          alt="Cava de Oro Premium Tequila"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4 md:px-6 hero-text">
          <div className="space-y-4 md:space-y-6">
            <p className="text-sm md:text-lg tracking-[0.2em] md:tracking-[0.3em] font-light uppercase text-amber-300">{translations[language].hero.subtitle}</p>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif italic text-amber-200 leading-tight">
              {translations[language].hero.title}
            </h1>
            <p className="text-lg md:text-xl tracking-[0.1em] md:tracking-[0.2em] font-light uppercase">{translations[language].hero.description}</p>
            <p className="text-xl md:text-2xl font-serif italic text-amber-300 mt-6 md:mt-8">{translations[language].hero.tagline}</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-800 mb-8 decorative-line">
              {language === 'english' ? (
                <>ABOUT <span className="text-gray-400">US</span></>
              ) : (
                <span className="text-gray-800">关于我们</span>
              )}
            </h2>
            <div className="flex justify-center mb-12">
              <Image
                src="https://ext.same-assets.com/297100652/3884887869.png"
                alt="Decorative line"
                width={400}
                height={20}
                className="opacity-60"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-xl text-gray-800 leading-relaxed font-light">
              {translations[language].about.intro1}
            </p>
            <p className="text-xl text-gray-800 leading-relaxed font-light">
              {translations[language].about.intro2}
            </p>
            <p className="text-xl text-gray-800 leading-relaxed font-light">
              {translations[language].about.intro3}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-8">
              {translations[language].about.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="cava" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-800 mb-8 decorative-line">
              {language === 'english' ? (
                <>CAVA <span className="text-gray-400">DE ORO</span></>
              ) : (
                <span className="text-gray-800">金窖龙舌兰</span>
              )}
            </h2>
            <div className="flex justify-center mb-12">
              <Image
                src="https://ext.same-assets.com/297100652/3884887869.png"
                alt="Decorative line"
                width={400}
                height={20}
                className="opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 max-w-7xl mx-auto">
            {productData.map((product) => (
              <Card
                key={product.id}
                className="text-center p-6 border-0 shadow-lg product-card cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => handleProductClick(product)}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={400}
                  className="mx-auto mb-6 h-80 object-contain"
                />
                <h3 className="text-sm font-light text-gray-600 tracking-wider">
                  {language === 'english' ? product.name : product.nameZh}
                </h3>
                <p className="text-xs text-amber-600 mt-2 font-medium">{translations[language].products.viewDetails}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif text-gray-800 mb-4">
                  {language === 'english' ? selectedProduct.name : selectedProduct.nameZh}
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="flex justify-center">
                  <Image
                    src={selectedProduct.image}
                    alt={language === 'english' ? selectedProduct.name : selectedProduct.nameZh}
                    width={300}
                    height={500}
                    className="max-h-96 object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'english' ? selectedProduct.description : selectedProduct.descriptionZh}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{translations[language].products.basicInfo}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">{translations[language].products.alcoholContent}:</span> {selectedProduct.alcoholContent}</p>
                        <p><span className="font-medium">{translations[language].products.aging}:</span> {language === 'english' ? selectedProduct.aging : selectedProduct.agingZh}</p>
                        <p><span className="font-medium">{translations[language].products.volume}:</span> {selectedProduct.volume}</p>
                        <p><span className="font-medium">NOM:</span> {selectedProduct.nom}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{translations[language].products.origin}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">{translations[language].products.region}:</span> {language === 'english' ? selectedProduct.region : selectedProduct.regionZh}</p>
                        <p><span className="font-medium">{translations[language].products.distillery}:</span> {language === 'english' ? selectedProduct.distillery : selectedProduct.distilleryZh}</p>
                        <p><span className="font-medium">{translations[language].products.price}:</span> <span className="text-amber-600 font-semibold">{selectedProduct.price}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{translations[language].products.tastingNotes}</h4>
                    <div className="flex flex-wrap gap-2">
                      {(language === 'english' ? selectedProduct.tastingNotes : selectedProduct.tastingNotesZh).map((note, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{translations[language].products.productionDetails}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {language === 'english' ? selectedProduct.productionDetails : selectedProduct.productionDetailsZh}
                    </p>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={() => addToCart(selectedProduct)}
                      className="flex-1 btn-primary"
                    >
                      {translations[language].products.addToCart}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      {translations[language].products.downloadCatalog}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Shopping Cart Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-gray-800 mb-4">
              {translations[language].cart.title}
            </DialogTitle>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">{translations[language].cart.empty}</p>
              <Button onClick={() => setIsCartOpen(false)}>
                {translations[language].cart.continueShopping}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <Image
                    src={item.image}
                    alt={language === 'english' ? item.name : item.nameZh}
                    width={80}
                    height={120}
                    className="object-contain"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {language === 'english' ? item.name : item.nameZh}
                    </h4>
                    <p className="text-gray-600">S${item.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700 text-sm"
                      >
                        {translations[language].cart.remove}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">S${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg">{translations[language].cart.subtotal}:</span>
                  <span className="text-lg font-semibold">S${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">{translations[language].cart.shipping}:</span>
                  <span className="text-lg font-semibold">S${getShippingCost().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-xl font-bold">{translations[language].cart.grandTotal}:</span>
                  <span className="text-xl font-bold text-amber-600">S${getTotalPrice()}</span>
                </div>

                <Button
                  onClick={() => {
                    setIsCartOpen(false)
                    setIsCheckoutOpen(true)
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 mt-4"
                >
                  {translations[language].cart.checkout}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-gray-800 mb-4">
              {orderComplete ? translations[language].cart.orderComplete : translations[language].checkout.title}
            </DialogTitle>
          </DialogHeader>

          {orderComplete ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-semibold text-green-600 mb-4">Order Completed Successfully!</h3>
              <p className="text-gray-600 mb-4">Thank you for your order. We will contact you shortly to confirm delivery details.</p>

              {/* Email Status */}
              <div className="mb-6">
                {emailStatus === 'sending' && (
                  <p className="text-blue-600 text-sm">📧 Sending order confirmation email...</p>
                )}
                {emailStatus === 'sent' && (
                  <p className="text-green-600 text-sm">✅ {translations[language].cart.emailSent}</p>
                )}
                {emailStatus === 'error' && (
                  <p className="text-red-600 text-sm">❌ {translations[language].cart.emailError}</p>
                )}
              </div>

              <Button onClick={resetCheckout}>
                {translations[language].cart.backToShopping}
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm">
                        {language === 'english' ? item.name : item.nameZh} x{item.quantity}
                      </span>
                      <span className="text-sm font-semibold">S${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>{translations[language].cart.subtotal}:</span>
                    <span>S${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{translations[language].cart.shipping}:</span>
                    <span>S${getShippingCost().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>{translations[language].cart.grandTotal}:</span>
                    <span className="text-amber-600">S${getTotalPrice()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{translations[language].checkout.personalInfo}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder={translations[language].checkout.firstName}
                      value={checkoutForm.firstName}
                      onChange={(e) => handleCheckoutFormChange('firstName', e.target.value)}
                    />
                    <Input
                      placeholder={translations[language].checkout.lastName}
                      value={checkoutForm.lastName}
                      onChange={(e) => handleCheckoutFormChange('lastName', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <Input
                      type="email"
                      placeholder={translations[language].checkout.email}
                      value={checkoutForm.email}
                      onChange={(e) => handleCheckoutFormChange('email', e.target.value)}
                    />
                    <Input
                      type="tel"
                      placeholder={translations[language].checkout.phone}
                      value={checkoutForm.phone}
                      onChange={(e) => handleCheckoutFormChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{translations[language].checkout.shippingAddress}</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder={translations[language].checkout.address}
                      value={checkoutForm.address}
                      onChange={(e) => handleCheckoutFormChange('address', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder={translations[language].checkout.city}
                        value={checkoutForm.city}
                        onChange={(e) => handleCheckoutFormChange('city', e.target.value)}
                      />
                      <Input
                        placeholder={translations[language].checkout.postalCode}
                        value={checkoutForm.postalCode}
                        onChange={(e) => handleCheckoutFormChange('postalCode', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder={translations[language].checkout.country}
                      value={checkoutForm.country}
                      onChange={(e) => handleCheckoutFormChange('country', e.target.value)}
                    />
                    <Textarea
                      placeholder={translations[language].checkout.notes}
                      value={checkoutForm.notes}
                      onChange={(e) => handleCheckoutFormChange('notes', e.target.value)}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{translations[language].checkout.paymentMethod}</h3>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setSelectedPaymentMethod('paynow')}
                        className={`flex-1 p-4 border rounded-lg text-center ${
                          selectedPaymentMethod === 'paynow' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-blue-600">PayNow</div>
                        <div className="text-sm text-gray-600">Scan QR Code</div>
                      </button>
                      <button
                        onClick={() => setSelectedPaymentMethod('paypal')}
                        className={`flex-1 p-4 border rounded-lg text-center ${
                          selectedPaymentMethod === 'paypal' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-yellow-600">PayPal</div>
                        <div className="text-sm text-gray-600">Secure Payment</div>
                      </button>
                    </div>

                    {selectedPaymentMethod === 'paynow' && (
                      <div className="bg-purple-50 p-6 rounded-lg text-center border-2 border-purple-500">
                        <div className="text-purple-700 font-bold text-xl mb-3">PayNow Payment</div>
                        <p className="text-sm text-gray-700 mb-4 font-medium">Scan this QR code with your banking app</p>
                        <div className="flex justify-center mb-4">
                          <div className="bg-white p-4 rounded-lg shadow-lg">
                            <Image
                              src="/images/paynow-qr.png"
                              alt="PayNow QR Code"
                              width={256}
                              height={256}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg mb-3">
                          <p className="text-sm text-gray-600 mb-1">UEN Number</p>
                          <p className="text-xl font-bold text-purple-700">201605046D</p>
                          <p className="text-xs text-gray-500 mt-2">(Use this if QR code doesn't work)</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-purple-800">Total Amount: S${getTotalPrice()}</p>
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === 'paypal' && (
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="flex justify-center items-center mb-3">
                          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold">PayPal</div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Secure payment with PayPal</p>
                        <p className="text-sm text-gray-600 mb-2">You will be redirected to PayPal to complete your payment</p>
                        <p className="text-xs text-gray-500">Total: S${getTotalPrice()}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing || !validateCheckoutForm()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {isProcessing ? translations[language].checkout.processing : translations[language].checkout.completeOrder}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Our Work Section */}
      <section id="work" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-800 mb-8 decorative-line">
              {language === 'english' ? (
                <>OUR <span className="text-gray-400">WORK</span></>
              ) : (
                <span className="text-gray-800">我们的工作</span>
              )}
            </h2>
            <div className="flex justify-center mb-12">
              <Image
                src="https://ext.same-assets.com/297100652/3884887869.png"
                alt="Decorative line"
                width={400}
                height={20}
                className="opacity-60"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">
              {translations[language].work.description1}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              {translations[language].work.description2}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-center mt-6">
              {translations[language].work.description3}
            </p>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex space-x-4">
              <Button variant="outline" className="px-8 py-2 text-gray-600 border-gray-300 hover:border-amber-500 hover:text-amber-600 transition-colors">WORK</Button>
              <Button variant="outline" className="px-8 py-2 text-gray-600 border-gray-300 hover:border-amber-500 hover:text-amber-600 transition-colors">PROJECTS</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "https://ext.same-assets.com/297100652/527603452.jpeg",
              "https://ext.same-assets.com/297100652/2868641408.jpeg",
              "https://ext.same-assets.com/297100652/2795359776.jpeg",
              "https://ext.same-assets.com/297100652/4251123588.jpeg",
              "https://ext.same-assets.com/297100652/1887542137.jpeg",
              "https://ext.same-assets.com/297100652/2437810660.jpeg",
              "https://ext.same-assets.com/297100652/1192104928.jpeg",
              "https://ext.same-assets.com/297100652/2055041918.jpeg"
            ].map((src, index) => (
              <div key={index} className="gallery-image aspect-square overflow-hidden rounded-lg cursor-pointer">
                <Image
                  src={src}
                  alt={`Work ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-800 mb-8 decorative-line">
              {language === 'english' ? (
                <>CONTACT <span className="text-gray-400">US</span></>
              ) : (
                <span className="text-gray-800">联系我们</span>
              )}
            </h2>
            <div className="flex justify-center mb-12">
              <Image
                src="https://ext.same-assets.com/297100652/3884887869.png"
                alt="Decorative line"
                width={400}
                height={20}
                className="opacity-60"
              />
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-lg text-gray-700 mb-4 font-light">
                {translations[language].contact.phone}
              </p>
              <p className="text-gray-600 mb-2">
                {translations[language].contact.description1}
              </p>
              <p className="text-gray-600">
                {translations[language].contact.description2}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* WhatsApp Contact Section */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-light text-gray-800 mb-6">{translations[language].contact.whatsapp}</h3>

                  {/* WhatsApp QR Code */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-green-50 p-8 rounded-lg shadow-lg border-2 border-green-500 max-w-md mx-auto">
                      <div className="text-center mb-4">
                        <div className="text-5xl mb-3">📱</div>
                        <h4 className="text-xl font-bold text-green-700 mb-2">{translations[language].contact.whatsappTitle}</h4>
                        <p className="text-gray-600 mb-4">
                          {translations[language].contact.whatsappDesc}
                        </p>
                        <div className="flex justify-center mb-4">
                          <div className="bg-white p-4 rounded-lg shadow-md">
                            <Image
                              src="/images/whatsapp-qr.png"
                              alt="WhatsApp QR Code"
                              width={200}
                              height={200}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <p className="text-sm text-gray-500 mb-2">{translations[language].contact.contactNumber}</p>
                          <p className="text-2xl font-bold text-green-600">+65 86895869</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Buttons */}
                  <div className="space-y-4">
                    <Button
                      onClick={() => window.open('https://wa.me/6586895869?text=Hello,%20I%20am%20interested%20in%20Cava%20de%20Oro%20tequila.%20Could%20you%20please%20provide%20more%20information?', '_blank')}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 font-medium tracking-wider flex items-center justify-center gap-2"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"/>
                      </svg>
                      {translations[language].contact.messageWhatsApp}
                    </Button>

                    <Button
                      onClick={() => window.open('tel:+6586895869')}
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50 py-3 font-medium tracking-wider flex items-center justify-center gap-2"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      {translations[language].contact.call}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
                  <h3 className="text-xl font-light text-gray-800 mb-6 tracking-wider">YOLO ADVENTURES PTE. LTD.</h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="font-light">〒079903</p>
                    <p className="font-light">10 Anson Road</p>
                    <p className="font-light">#21-07 International Plaza</p>
                    <p className="font-light">Singapore</p>
                    <div className="border-t border-gray-200 my-4 pt-4">
                      <p className="font-light">Phone: +65 86895869</p>
                      <p className="font-light">Email: yuki.a@yoload.asia</p>
                      <p className="font-light">Website: https://cavadeoro.yoload.asia/</p>
                    </div>
                    <p className="text-sm text-gray-500 font-light">Contact: YUKI ASHIZAKI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-serif italic text-white mb-2">
              Cava de Oro
            </h3>
            <p className="text-gray-400 tracking-wider font-light">YOLO ADVENTURES PTE. LTD.</p>
          </div>

          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.90-5.367 11.99-11.99C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </a>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm font-light">
              Copyright Cava de Oro - All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
      <Toaster />
    </main>
  )
}
