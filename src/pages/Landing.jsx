import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Code2, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Quote,
  Mic2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  {
    icon: Code2,
    title: 'Master DSA',
    description: 'Practice 500+ coding problems with AI-powered hints and editorials'
  },
  {
    icon: Mic2,
    title: 'Mock Interviews',
    description: 'Realistic technical interviews powered by AI with instant feedback'
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description: 'Personalized preparation roadmap tailored to your target companies'
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Real-time analytics and insights to monitor your improvement'
  },
  {
    icon: Zap,
    title: 'Resume Builder',
    description: 'AI-powered resume analyzer to optimize for ATS systems'
  },
  {
    icon: Star,
    title: 'Community',
    description: 'Connect with peers and learn from placement success stories'
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ students: '2,459+', problems: '500+', companies: '100+' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dark-50 dark:from-dark-900 dark:to-dark-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container-centered relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-dark-900 dark:text-white mb-6">
              Your AI-Powered
              <span className="text-gradient"> Placement Companion</span>
            </h1>
            <p className="text-xl text-dark-600 dark:text-dark-400 mb-8 max-w-2xl mx-auto">
              Practice coding problems, ace mock interviews, and land your dream job at top tech companies
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary group inline-flex items-center gap-2"
              >
                Try for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#features" className="btn-outline inline-flex items-center gap-2">
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-16">
              {[
                { label: 'Students Placed', value: stats.students },
                { label: 'Problems', value: stats.problems },
                { label: 'Companies', value: stats.companies }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stat.value}
                  </p>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500 to-cyan-500 h-96"
            >
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-20 h-20 text-white opacity-70" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-dark-900">
        <div className="container-centered">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Comprehensive tools and resources to prepare for your dream placement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card p-8 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-dark-50 dark:bg-dark-800">
        <div className="container-centered">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Loved by Students
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400">
              Join thousands of students who landed their dream jobs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rahul Sharma',
                role: 'SDE @ Google',
                college: 'IIT Delhi',
                quote: 'PlacementGPT helped me crack the Google interview. The mock interviews were incredibly realistic!'
              },
              {
                name: 'Priya Patel',
                role: 'Analyst @ Goldman Sachs',
                college: 'BITS Pilani',
                quote: 'The AI hints saved so much time. I could focus on understanding rather than getting stuck.'
              },
              {
                name: 'Aditya Kumar',
                role: 'SDE @ Amazon',
                college: 'NIT Trichy',
                quote: 'From struggling with medium problems to solving hard ones. PlacementGPT made all the difference!'
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary-400 mb-4 opacity-50" />
                <p className="text-dark-700 dark:text-dark-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-dark-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-dark-600 dark:text-dark-400">
                    {testimonial.college}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-cyan-500">
        <div className="container-centered text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get started for free. No credit card required.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Now
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
